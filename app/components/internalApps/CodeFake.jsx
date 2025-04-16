"use client";

import { useState, useEffect } from "react";

const CodeFake = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState([]);

  const codeWords = [
    "#include", "<iostream>", "\n",
    "#include", "<vector>", "\n", 
    "#include", "<quantum.hpp>", "\n",
    "#include", "<neural_net.h>", "\n",
    "#include", "<blockchain.h>", "\n", 
    "#include", "<ai_core.hpp>", "\n",
    "#include", "<linear_algebra.h>", "\n",
    "#include", "<api_client.h>", "\n\n",
    
    "namespace", "quantum", "{", "\n",
    "class", "QuantumNeuralProcessor", "{", "\n", 
    "private:", "\n",
    "    ", "std::vector<double>", "quantum_weights;", "\n",
    "    ", "int", "entanglement_state;", "\n",
    "    ", "float", "coherence_time;", "\n",
    "    ", "BlockchainLedger", "neural_chain;", "\n",
    "    ", "AICore::Intelligence", "quantum_ai;", "\n",
    "    ", "Matrix<double>", "transformation_matrix;", "\n",
    "    ", "APIClient", "mainframe_api;", "\n\n",

    "public:", "\n",
    "    ", "QuantumNeuralProcessor()", ":", "coherence_time(0.0)", "{", "\n",
    "        ", "quantum_weights.resize(4096);", "\n",
    "        ", "initialize_quantum_state();", "\n",
    "        ", "neural_chain.mine_intelligence();", "\n",
    "        ", "transformation_matrix", "=", "Matrix<double>::Identity(4096, 4096);", "\n",
    "    ", "}", "\n\n",

    "    ", "void", "apply_quantum_transform()", "{", "\n",
    "        ", "for", "(auto", "&qubit", ":", "quantum_weights)", "{", "\n",
    "            ", "qubit", "*=", "std::exp(i", "*", "PI", "/", "4);", "\n",
    "            ", "quantum_ai.enhance(qubit);", "\n",
    "        ", "}", "\n",
    "    ", "}", "\n\n",

    "    ", "Matrix<complex<double>>", "create_hadamard()", "{", "\n",
    "        ", "return", "quantum::hadamard(16)", "*", "neural::activation();", "\n",
    "    ", "}", "\n\n",

    "    ", "void", "hack_mainframe()", "{", "\n",
    "        ", "decrypt_firewall();", "\n",
    "        ", "bypass_security_protocols();", "\n",
    "        ", "neural_chain.distribute_quantum_tokens();", "\n",
    "        ", "mainframe_api.post(\"/hack\", quantum_payload);", "\n",
    "    ", "}", "\n\n",

    "    ", "Matrix<double>", "compute_eigendecomposition()", "{", "\n",
    "        ", "auto", "eigenvectors", "=", "transformation_matrix.eigenVectors();", "\n",
    "        ", "auto", "eigenvalues", "=", "transformation_matrix.eigenValues();", "\n",
    "        ", "return", "eigenvectors", "*", "eigenvalues.asDiagonal();", "\n",
    "    ", "}", "\n\n",

    "    ", "void", "perform_svd_analysis()", "{", "\n",
    "        ", "auto", "[U,S,V]", "=", "transformation_matrix.svd();", "\n",
    "        ", "quantum_ai.optimize_using_svd(U,S,V);", "\n",
    "        ", "mainframe_api.post(\"/optimize\", {U,S,V});", "\n",
    "    ", "}", "\n\n",

    "    ", "quantum_bits", "process_neural_state()", "{", "\n",
    "        ", "auto", "state", "=", "get_superposition();", "\n",
    "        ", "apply_quantum_transform();", "\n",
    "        ", "quantum_ai.evolve(state);", "\n",
    "        ", "neural_chain.verify_quantum_state(state);", "\n",
    "        ", "auto", "decomposition", "=", "compute_eigendecomposition();", "\n",
    "        ", "perform_svd_analysis();", "\n",
    "        ", "mainframe_api.get(\"/quantum_state\");", "\n",
    "        ", "return", "measure_quantum_state();", "\n",
    "    ", "}", "\n\n",

    "    ", "void", "train_quantum_network()", "{", "\n",
    "        ", "Matrix<double>", "training_data", "=", "fetch_training_data();", "\n",
    "        ", "for", "(int", "epoch", "=", "0;", "epoch", "<", "1000;", "epoch++)", "{", "\n",
    "            ", "auto", "gradients", "=", "compute_quantum_gradients();", "\n",
    "            ", "update_weights(gradients);", "\n",
    "            ", "mainframe_api.post(\"/training_progress\", {epoch, loss});", "\n",
    "        ", "}", "\n",
    "    ", "}", "\n\n",

    "int", "main()", "{", "\n",
    "    ", "QuantumNeuralProcessor", "processor;", "\n",
    "    ", "processor.hack_mainframe();", "\n",
    "    ", "processor.train_quantum_network();", "\n",
    "    ", "auto", "result", "=", "processor.process_neural_state();", "\n",
    "    ", "std::cout", "<<", "\"Neural Quantum State: \"", "<<", "result", "<<", "std::endl;", "\n",
    "    ", "std::cout", "<<", "\"Mainframe Access: GRANTED\"", "<<", "std::endl;", "\n",
    "    ", "return", "0;", "\n",
    "}", "\n",
    "}", // namespace closing
  ];

  useEffect(() => {
    const handleKeyPress = () => {
      if (currentIndex < codeWords.length) {
        setDisplayedCode(prev => [...prev, " "+codeWords[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex]);

  return (
    <div className="bg-black min-h-[90vh] p-8">
      <pre className="text-[#11ff11] font-mono whitespace-pre-wrap">
        {displayedCode.join('')}
      </pre>
    </div>
  );
};

export default CodeFake;
